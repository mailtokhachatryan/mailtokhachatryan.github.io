import { PROFILE } from '@/lib/career'

/* Tokens are marked up by hand rather than run through a highlighter — it is
   twenty lines of static Java, and a syntax library would cost more gzipped
   than the whole rest of the page. */
const K = ({ children }: { children: React.ReactNode }) => (
  <span className="tok-kw">{children}</span>
)
const T = ({ children }: { children: React.ReactNode }) => (
  <span className="tok-type">{children}</span>
)
const S = ({ children }: { children: React.ReactNode }) => (
  <span className="tok-str">{children}</span>
)
const F = ({ children }: { children: React.ReactNode }) => (
  <span className="tok-field">{children}</span>
)
const N = ({ children }: { children: React.ReactNode }) => (
  <span className="tok-num">{children}</span>
)

export default function CodeWindow({ years }: { years: number }) {
  return (
    <div className="code-window">
      <div className="code-bar">
        <span className="code-dot" data-c="r" />
        <span className="code-dot" data-c="y" />
        <span className="code-dot" data-c="g" />
        <span className="code-file mono">AghasiKhachatryan.java</span>
      </div>

      <pre className="code-body mono">
        <code>
          <K>public class</K> <T>AghasiKhachatryan</T> {'{'}
          {'\n\n'}
          {'  '}
          <K>static final</K> <T>String</T> <F>ROLE</F> ={' '}
          <S>&quot;{PROFILE.role}&quot;</S>;{'\n'}
          {'  '}
          <K>static final</K> <T>String</T> <F>COMPANY</F> ={' '}
          <S>&quot;OMD — Tick Data&quot;</S>;{'\n'}
          {'  '}
          <K>static final</K> <T>String</T> <F>LOCATION</F> ={' '}
          <S>
            &quot;{PROFILE.location} ({PROFILE.timezone})&quot;
          </S>
          ;{'\n'}
          {'  '}
          <K>static final</K> <K>int</K> <F>YOE</F> = <N>{years}</N>;{'\n\n'}
          {'  '}
          <T>List</T>&lt;<T>String</T>&gt; <F>focus</F> = <T>List</T>.of({'\n'}
          {'    '}
          <S>&quot;Distributed Systems &amp; Microservices&quot;</S>,{'\n'}
          {'    '}
          <S>&quot;Java 21, Micronaut, Spring Boot&quot;</S>,{'\n'}
          {'    '}
          <S>&quot;Go concurrency, gRPC, Kafka&quot;</S>,{'\n'}
          {'    '}
          <S>&quot;AWS, Kubernetes, CI/CD&quot;</S>
          {'\n'}
          {'  '});{'\n'}
          {'}'}
        </code>
      </pre>
    </div>
  )
}
